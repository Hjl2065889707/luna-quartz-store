export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F1]">
      <main className="flex-1 bg-[#FBF7F1]">{children}</main>
    </div>
  )
}
