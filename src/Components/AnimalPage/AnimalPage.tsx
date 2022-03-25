import axios from "axios";
import { useEffect, useState } from "react"
import { Link, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiResponse } from "../../Models/apiResponse";

export function AnimalPage() {
    const [animalId, setAnimalId] = useState(0);

    // Denna används enbart för att ha ett state jag använder när man matar djuret, så att jag kan uppdatera HTML utan att uppdatera hemsidan. 
    const [myClick, setMyClick] = useState(0);

    const [myHtml, setMyHtml] = useState(<></>);
    const [animals, setAnimals] = useState<apiResponse[]>([]);
    
    const apiUrl = 'https://animals.azurewebsites.net/api/animals';
    // let myHtml = (<></>);
    // let animals: apiResponse[] = [];
    let params = useParams();
    let currentDate: Date = new Date();
    let myTime = '' + currentDate.getHours() + ':' + currentDate.getMinutes();
    let myAnimals = animals;

    // Fyll på listan om den är tom, och ifall localStorage finns fyller den därifrån, annars ifrån api:et
    useEffect (() => {
        if (animals.length > 0) return;
            if (localStorage.animals) {
                setAnimals(JSON.parse(localStorage.animals));
            } else {
                axios.get<apiResponse[]>(apiUrl).then((response) => { 
                    setAnimals(response.data);
                })
            }
    });
    // Sätter animalId till rätt id beroende på URL parameter
    useEffect(() => {
        if (params.id) {
            setAnimalId(+params.id);
        }
    }, []); 
    

    useEffect(() => {
        for (let i = 0; i < animals.length; i++) {
            if (animals[i].id == animalId) {
                setMyHtml(
                <div>
                    <Link to="/"><button>Home</button></Link>
                    <h3>{animals[i].name}</h3>
                    <p>{animals[i].longDescription} </p>
                    <i>{animals[i].name} vart senast matad: {animals[i].lastFed}</i>
                    <br></br>
                    <button onClick={feedAnimal} disabled={animals[i].isFed}>Mata mig!</button>
                </div>
                )
            }
        }
    }, [animals, myClick]);

    // Går igenom listan och ser till att rätt djur ändras, sen ökar vi myClick med 1 för att tvinga HTML:en att uppdateras. 
    function feedAnimal() {
        for (let i = 0; i < myAnimals.length; i++) {
             if (myAnimals[i].id == animalId)
                myAnimals[i].isFed = true;
                myAnimals[i].lastFed = myTime;
                setAnimals(myAnimals);
                setMyClick(+1);
                localStorage.setItem('animals', JSON.stringify(myAnimals));
            }
    }
    return (<>{myHtml}</>)
}