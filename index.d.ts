import React, { AriaAttributes } from 'react'

declare module 'react' {
  interface ClassNamesObject {
    [key: string]: boolean
  }

  type ClassNames = string | (string | boolean)[] | ClassNamesObject

  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    classNames?: ClassNames
    styleNames?: ClassNames
  }
}