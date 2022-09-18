export const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-start h-full ${className}`}>
      <a href='/' className='inline-block py-4 md:py-0'>
        <h1 className='p-1'>
          <span className='text-xl font-black text-black dark:text-gray-50'>
            eventos
            <span className='text-xl font-black leading-none text-primary'>
              .wiki
            </span>
          </span>
        </h1>
      </a>
    </div>
  )
}
