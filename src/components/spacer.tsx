import React from 'react'

export default function spacer({margin=0, children}) {
  return (
    <div style={{margin}}>
      {children}
    </div>
  )
}
