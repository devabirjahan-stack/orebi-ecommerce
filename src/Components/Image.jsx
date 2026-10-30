import React from 'react'

const Image = ({ Source, Alt, ClassName }) => {
  return (
    <img src={Source} alt={Alt} className={ClassName} />
  )
}

export default Image
