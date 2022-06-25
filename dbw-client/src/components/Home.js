import React from 'react'
import { useSelector} from 'react-redux'
import Dashboard from './Dashboard'
import Header from './Header'

const Home = () => {
    const userData = useSelector((state)=> state.userReducer);

      
  return (
    <>
    <Header />
    <Dashboard />
    </>
  )
}

export default Home