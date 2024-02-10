import axios from "axios"

export default axios.create({
    //baseURL: "http://localhost:42999/api"
    baseURL: "https://workshopv01-pro3.azurewebsites.net/api"
})