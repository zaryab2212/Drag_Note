import React, { forwardRef } from 'react'

const Note = forwardRef(({data},ref) => {
  return (
    <div ref={ref} style={{top:data?.position?.positionX, left:data?.position?.positionZ}} className='note'>
        {data?.text}
    </div>
  )
}
)
export default Note