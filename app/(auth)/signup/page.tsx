'use client'

import React, { useState } from 'react'
import { Country, State } from 'country-state-city'
import { signIn } from 'next-auth/react'
import { SignupFormValues, signupSchema } from '@/lib/schemas/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const MAX_STEP = 3

const SignupPage = () => {
  const [step, setStep] = useState(1)

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    getValues,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
      state: '',
    },
  })

  const selectedCountry = watch('country')

  const nextStep = async () => {
    let isStepValid = false
    
    if (step === 1) {
      isStepValid = await trigger(['name', 'email'])
      
      // 核心魔改：只有 Zod 点头放行了，我们才舍得花网络开销去查数据库
      if (isStepValid) {
        const emailToTest = getValues('email')
        try {
          const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(emailToTest)}`)
          const data = await res.json()
          
          if (data.exists) {
            // 发现重复邮箱，用警员身份开出罚单！
            setError('email', { type: 'manual', message: 'This email is already registered' })
            isStepValid = false // 直接拉下红灯电闸！
          }
        } catch (err) {
          console.error('Failed to verify email uniqueness', err)
        }
      }
    }
    
    if (step === 2) {
      isStepValid = await trigger(['country', 'state'])
    }

    if (!isStepValid) return

    if (step >= MAX_STEP) return
    return setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    if (step <= 1) return
    return setStep((prev) => prev - 1)
  }

  const onSubmit = async (data: SignupFormValues) => {
    try {
      console.log('数据:', data)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
        })
      } else {
        const errorData = await res.json()
        console.error(errorData)
      }
    } catch (error) {
      console.error('程序有问题')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F4F7] p-4 font-sans">
      {/* 沉浸式卡片容器 (Meta Store Standard 20px radius & elevated shadow) */}
      <div className="w-full max-w-lg rounded-[20px] bg-white p-8 shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] transition-all sm:p-10">
        {/* 头部信息 */}
        <h1 className="mb-2 text-center text-[28px] font-medium tracking-tight text-[#1C2B33]">
          Create Account
        </h1>
        <p className="mb-6 text-center text-[16px] text-[#5D6C7B]">
          Step {step} of 3
        </p>

        {/* 视觉进度条 (Pill indicators) */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? 'bg-[#0064E0]' : 'bg-[#DEE3E9]'
              }`}
            />
          ))}
        </div>

        {/* 动态表单区域 */}
        <div className="min-h-[180px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-5 duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#1C2B33]">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className={`w-full border bg-white ${errors.name ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#CED0D4] focus:border-[#0064E0] focus:ring-[#0064E0]'} rounded-lg px-4 py-3 text-[16px] text-[#050505] placeholder-[#65676B] backdrop-blur-sm transition-colors focus:ring-1 focus:outline-none`}
                />
                {errors.name && (
                  <span className="text-[14px] font-medium text-[#E41E3F]">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#1C2B33]">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full border bg-white ${errors.email ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#CED0D4] focus:border-[#0064E0] focus:ring-[#0064E0]'} rounded-lg px-4 py-3 text-[16px] text-[#050505] placeholder-[#65676B] transition-colors focus:ring-1 focus:outline-none`}
                />
                {errors.email && (
                  <span className="text-[14px] font-medium text-[#E41E3F]">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-5 duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#1C2B33]">
                  Country or Region
                </label>
                <select
                  {...register('country', {
                    onChange: () => setValue('state', ''),
                  })}
                  className={`w-full border bg-white ${errors.country ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#CED0D4] focus:border-[#0064E0] focus:ring-[#0064E0]'} cursor-pointer rounded-lg px-4 py-3 text-[16px] text-[#050505] transition-colors focus:ring-1 focus:outline-none`}
                >
                  <option value="">-- Please select a country --</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <span className="text-[14px] font-medium text-[#E41E3F]">
                    {errors.country.message}
                  </span>
                )}
              </div>

              {selectedCountry &&
                State.getStatesOfCountry(selectedCountry).length !== 0 && (
                  <div className="animate-in fade-in flex flex-col gap-2 duration-300">
                    <label className="text-[16px] font-medium text-[#1C2B33]">
                      State / Province
                    </label>
                    <select
                      {...register('state')}
                      disabled={!selectedCountry}
                      className={`w-full border bg-white ${errors.state ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#CED0D4] focus:border-[#0064E0] focus:ring-[#0064E0]'} cursor-pointer rounded-lg px-4 py-3 text-[16px] text-[#050505] transition-colors focus:ring-1 focus:outline-none disabled:bg-[#F1F4F7] disabled:text-[#BCC0C4]`}
                    >
                      <option value="">-- Please select a state --</option>
                      {State.getStatesOfCountry(selectedCountry).map(
                        (stateItem) => (
                          <option
                            key={stateItem.isoCode}
                            value={stateItem.isoCode}
                          >
                            {stateItem.name}
                          </option>
                        ),
                      )}
                    </select>
                    {errors.state && (
                      <span className="text-[14px] font-medium text-[#E41E3F]">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-5 duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#1C2B33]">
                  Create Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  {...register('password')}
                  className={`w-full border bg-white ${errors.password ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#CED0D4] focus:border-[#0064E0] focus:ring-[#0064E0]'} rounded-lg px-4 py-3 text-[16px] text-[#050505] placeholder-[#65676B] transition-colors focus:ring-1 focus:outline-none`}
                />
                {errors.password && (
                  <span className="text-[14px] font-medium text-[#E41E3F]">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作区 (Pill Buttons 完美复刻) */}
        <div className="mt-10 flex gap-4 border-t border-[#DEE3E9] pt-6">
          {/* Back 按钮：Secondary Outlined Pill */}
          <button
            onClick={prevStep}
            disabled={step <= 1}
            className="flex-1 rounded-full border-2 border-[rgba(10,19,23,0.12)] px-[22px] py-[10px] text-[14px] font-bold text-[#1C2B33] transition-colors hover:bg-[#F1F4F7] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Back
          </button>

          {step < MAX_STEP ? (
            <button
              onClick={nextStep}
              className="flex-1 rounded-full bg-[#0064E0] px-[22px] py-[10px] text-[14px] font-bold text-white transition-all hover:bg-[#0143B5] active:scale-[0.98] active:bg-[#004BB9]"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex-1 rounded-full bg-[#31A24C] px-[22px] py-[10px] text-[14px] font-bold text-white shadow-md shadow-[#31A24C]/20 transition-all hover:bg-[#007D1E] active:scale-[0.98]"
            >
              Complete Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignupPage
