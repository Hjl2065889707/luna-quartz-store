'use client'

import { useState } from 'react'
import { Country, State } from 'country-state-city'
import { signIn } from 'next-auth/react'
import { SignupFormValues, signupSchema } from '@/lib/schemas/auth'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_STEP = 3

const SignupPage = () => {
  const [step, setStep] = useState(1)

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    control,
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

  const selectedCountry = useWatch({
    control,
    name: 'country',
  })

  const nextStep = async () => {
    let isStepValid = false

    if (step === 1) {
      isStepValid = await trigger(['name', 'email'])

      if (isStepValid) {
        const emailToTest = getValues('email')
        try {
          const res = await fetch(
            `/api/auth/check-email?email=${encodeURIComponent(emailToTest)}`,
          )
          const data = await res.json()

          if (data.exists) {
            setError('email', {
              type: 'manual',
              message: 'This email is already registered',
            })
            isStepValid = false
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
      console.error(error, 'Unexpected signup error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF7F1] p-4 font-sans">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#E8E1D8] bg-white p-8 shadow-[0_24px_70px_rgba(74,50,39,0.12)] transition-all sm:p-10">
        <h1 className="mb-2 text-center text-[30px] font-black tracking-tight text-[#2F2523]">
          Create Account
        </h1>
        <p className="mb-6 text-center text-[16px] text-[#7B6D66]">
          Step {step} of 3
        </p>

        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? 'bg-[#B76E79]' : 'bg-[#E8E1D8]'
              }`}
            />
          ))}
        </div>

        <div className="min-h-[180px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-5 duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#2F2523]">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className={`w-full border bg-white ${errors.name ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#E8E1D8] focus:border-[#B76E79] focus:ring-[#E9D8DC]'} rounded-2xl px-4 py-3 text-[16px] text-[#2F2523] placeholder-[#B9AAA2] backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none`}
                />
                {errors.name && (
                  <span className="text-[14px] font-medium text-[#E41E3F]">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[#2F2523]">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full border bg-white ${errors.email ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#E8E1D8] focus:border-[#B76E79] focus:ring-[#E9D8DC]'} rounded-2xl px-4 py-3 text-[16px] text-[#2F2523] placeholder-[#B9AAA2] transition-colors focus:ring-2 focus:outline-none`}
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
                <label className="text-[16px] font-medium text-[#2F2523]">
                  Country or Region
                </label>
                <select
                  {...register('country', {
                    onChange: () => setValue('state', ''),
                  })}
                  className={`w-full border bg-white ${errors.country ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#E8E1D8] focus:border-[#B76E79] focus:ring-[#E9D8DC]'} cursor-pointer rounded-2xl px-4 py-3 text-[16px] text-[#2F2523] transition-colors focus:ring-2 focus:outline-none`}
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
                    <label className="text-[16px] font-medium text-[#2F2523]">
                      State / Province
                    </label>
                    <select
                      {...register('state')}
                      disabled={!selectedCountry}
                      className={`w-full border bg-white ${errors.state ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#E8E1D8] focus:border-[#B76E79] focus:ring-[#E9D8DC]'} cursor-pointer rounded-2xl px-4 py-3 text-[16px] text-[#2F2523] transition-colors focus:ring-2 focus:outline-none disabled:bg-[#F4EEE6] disabled:text-[#B9AAA2]`}
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
                <label className="text-[16px] font-medium text-[#2F2523]">
                  Create Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  {...register('password')}
                  className={`w-full border bg-white ${errors.password ? 'border-[#E41E3F] focus:ring-[#E41E3F]' : 'border-[#E8E1D8] focus:border-[#B76E79] focus:ring-[#E9D8DC]'} rounded-2xl px-4 py-3 text-[16px] text-[#2F2523] placeholder-[#B9AAA2] transition-colors focus:ring-2 focus:outline-none`}
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

        <div className="mt-10 flex gap-4 border-t border-[#E8E1D8] pt-6">
          <button
            onClick={prevStep}
            disabled={step <= 1}
            className="flex-1 rounded-full border border-[#E8E1D8] px-[22px] py-[10px] text-[14px] font-bold text-[#2F2523] transition-colors hover:bg-[#F4EEE6] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Back
          </button>

          {step < MAX_STEP ? (
            <button
              onClick={nextStep}
              className="flex-1 rounded-full bg-[#2F2523] px-[22px] py-[10px] text-[14px] font-bold text-white transition-all hover:bg-[#4A3732] active:scale-[0.98]"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex-1 rounded-full bg-[#B76E79] px-[22px] py-[10px] text-[14px] font-bold text-white shadow-md shadow-[#B76E79]/20 transition-all hover:bg-[#8F4F5B] active:scale-[0.98]"
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
