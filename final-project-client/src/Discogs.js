import React from 'react'
import styles from './Discogs.module.css'

class Discogs extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            albums : [],
            error : null,
        }
    }

    fetchAlbums = (event) =>{
        fetch("https://api.discogs.com/database/search?key=xLxRhchBfxfAOtMiCAxV&secret=WzSiMvgXqyscrehWUFYekOIVICGYkNmH&artist="+document.getElementById('artist').value+"&country=canada",
            {
                method: 'GET',
            }
        )
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                    // handle errors, response code other than 200 because
                    return {} //empty object, no data
                } else {
                    //ok code 200, convert data in FETCH response to JSON data
                    return response.json()
                }
                //execute second .then when done
            })
            .then(
                //executes after the first .then
                (data) => {// catch the data returned by first .then
                    //check for not empty data object
                    if (data.results.length !== 0) {
                        this.setState({albums : data.results})
                    }
                    else{
                        document.getElementById("artist").value = 'artist not found'
                    }
                },

                (error) => {
                    // only NO RESPONSE URL errors will trigger this code
                    document.getElementById("recieved_data").innerHTML = "AJAX error: URL wrong or unreachable, see console"
                }
            )
    }

    addTrack = (event) =>{
        let data = {
                id: this.state.albums[event.target.value].id,
                playlist: this.state.albums[event.target.value].style,
                title: this.state.albums[event.target.value].title,
                uri: this.state.albums[event.target.value].uri,
                master_id: this.state.albums[event.target.value].master_id,
                thumb: this.state.albums[event.target.value].thumb
            }
        fetch("http://localhost:8000/tracks",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
            }
        )
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                    // handle response code other than 200 because
                    return ""
                } else {
                    //server responds with text/html, execute second .then when done
                    let self = this
                    self.props.onAddTrack()
                    return response.text()
                }
            })
            .then(
                (server_text) => {
                    // show text reply on page
                },

                (error) => {
                    // only NO RESPONSE URL errors will trigger this code
                    document.getElementById("response_data").innerHTML = "AJAX error: URL wrong or unreachable, see console"
                }
            )
    }

    rowCreator = (onevalue,index) =>{
        return (<div key={index} className={styles.card}>
                        <img src={onevalue.thumb} alt={onevalue.title} />
                        <div className={styles.container}>
                            <b>{onevalue.title}</b><br/><br/>
                            Style : {onevalue.style}<br/>
                            Year Release : {onevalue.year}<br/>
                            <a href={"http://www.discogs.com"+onevalue.uri}>More Information</a><br/>
                            master_id : {onevalue.master_id}<br/>
                            <button className={styles.searchButton} value={index} onClick={(event)=> this.addTrack(event)}>Add</button>
                        </div>
                </div>)
    }

    render () {
        return (
            <div>
                <div className={styles.search}>
                    <input type='text' id='artist' className={styles.searchTerm} placeholder="What are you looking for?"/>
                    <button onClick={(event) => this.fetchAlbums(event)} className={styles.searchButton}>
                        Search
                    </button>
                </div>
                <div id='recieved_data' className={styles.dataDiv}>
                    {this.state.albums.map(this.rowCreator)}
                </div>
            </div>

            )
        }
    }

export default Discogs
