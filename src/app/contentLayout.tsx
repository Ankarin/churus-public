export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="max-w-4xl px-2 mx-auto py-8">{children}</div>;
}
