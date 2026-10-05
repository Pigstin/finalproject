import { useState } from "react";

function CharlotteTestZone() {
    return(
        <form action='/lobby/create' method='POST'> 
                    <input type='text' name='username'/>
                    <input type='submit'/>
        </form>
    )
}

export default CharlotteTestZone