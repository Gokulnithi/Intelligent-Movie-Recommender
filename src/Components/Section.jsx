import { useNavigate } from "react-router-dom"

export default function Section(){
    const navigate = useNavigate();
    function handleTry(){
        navigate("/Movies")
    }
    return(
        <div className="contG">
            <div className="lf">
                <h1>Movie Recommender</h1>
                <p>This was a movie recommender build with react and also used ML techniques <br /> 
                <br /> 
                    <span className="credit">  App Developed By Dhanush Kumar, Mugesh, Gokulnithi  </span><br /><br />
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam adipisci obcaecati laudantium consectetur. Iste quis dolorum, modi ducimus odit eligendi accusamus odio assumenda magni deleniti. Sapiente molestiae dignissimos iste reprehenderit!
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita numquam ducimus cupiditate quas esse, ab neque, temporibus voluptate non laboriosam quisquam magnam nulla omnis quaerat iure alias reiciendis rem vel? Qui, veniam accusamus sed ipsa repellat quod ab?
                </p>
                <button onClick={handleTry}> Try it </button>
            </div>
            <div className="rf">
                <img className="imgP"src="https://wallpapercave.com/wp/wp10615907.jpg" alt="" />
            </div>
        </div>
    )
}