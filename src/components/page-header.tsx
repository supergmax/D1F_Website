interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className = "" }: PageHeaderProps) {
  return (
    <div className={`py-20 bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#4E463F] mb-4">{title}</h1>
        {description && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>}
      </div>
    </div>
  )
}
