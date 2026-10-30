import React from 'react'

const Container = ({ children }) => {
  return (
    <div className="px-4 sm:px-8 md:px-16 xl:px-37.5">
      {children}
    </div>
  )
}

export default Container