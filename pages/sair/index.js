import { useEffect, useState, useMemo } from 'react'
import Router from 'next/router'

import _ from 'lodash';


const Sair = () => {

  useEffect(() => {
    window.localStorage.removeItem("us_cpf");
    Router.push('/');
  }, [])

  return (
    <div>
      
    </div>
  )
}

export default Sair
