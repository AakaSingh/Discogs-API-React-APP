import React from 'react'
import styles from './Header.module.css'

class Header extends React.Component {

    render () {
        if(this.props.heading){
        return (
            <header>
                <div  className={styles.header}>
                    <h1>{this.props.heading}</h1>
                </div>
            </header>
        )} else{
            return(
            <p>company name not given</p>
            )
        }
    }
}

export default Header
