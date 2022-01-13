import React from 'react';

export default function DisplayTable(props) {

    const displayData = (props) => {
        const {menu, datas} = props;

        if (datas.length > 0) {
            return(
                datas.map((data,index) => {
                    console.log(data);
                    return(
                        <div class='row mb-2'>
                            <div class='col' style={{fontSize: "24px"}}>{data.StockId}</div> 
                            <div class='col-10' style={{fontSize: "20px"}}>{data.Text}</div>
                        </div>
                    )
                } )
            )
        } else {
            return (<p>Nothing to show yet</p>)
        }
    }
    return(
        <>
            {displayData(props)}
        </>
    )
}