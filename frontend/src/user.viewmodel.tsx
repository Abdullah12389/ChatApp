import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
class UserStore{
    user = null
    isLoading:Boolean
    constructor(){
        makeAutoObservable(this);
        this.checkAuth()
    }
    setUser(userData){
        this.user = userData
    }
    checkAuth = async ()=>{
        const response = await axios.get("http://localhost:3000/me")
        runInAction(()=> this.user = response.data.user)
    }
}
const userStore = new UserStore()