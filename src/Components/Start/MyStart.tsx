import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Route } from "react-router-dom";
import { apiResponse } from "../../Models/apiResponse";
import { AnimalPage } from "../AnimalPage/AnimalPage";

export function MyStart() {
    const apiUrl = 'https://animals.azurewebsites.net/api/animals';
    
    const [post, setPost] = useState<apiResponse[]>([]);
    
    localStorage.setItem('animals', JSON.stringify(post));
    let animals = JSON.parse(localStorage.animals);
    
    let alist = post.map((animal) => {
        let animalLink = `/animal/${animal.id}`;
        return (
        <div key={animal.name}>
            <Link to={animalLink}>{animal.name}</Link>
            {animal.shortDescription}
        </div>
        )
    });
    // 

    useEffect(() => {
        if (post.length > 0) return;

        axios.get<apiResponse[]>(apiUrl).then((response) => {
            setPost(response.data);
        });
    })
    
    return(<><div><ul>{alist}</ul></div></>)

}