document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    let tableResult = document.getElementById('tableResult');
    if (!tableResult) {
        tableResult = document.createElement('table');
    }

    const updateTable = (ctype, price, volume, priceChange) => {
        const tableRows = `
            <tr style="background-color:blue; color:white; font-weight:700">
                 <td>
                    PROPERTY
                 </td>
                <td>VALUE</td>
            </tr>       
            <tr>
                <td>
                    ${ctype.toUpperCase()}
                </td>
                <td>$${price}</td>
            </tr>
            <tr>
                <td>
                    Volume
                </td>
                <td>${volume}</td>
            </tr>
            <tr>
                <td>
                    Change (24h)
                </td>
                <td>${priceChange}%</td>
            </tr>`;
        tableResult.innerHTML = tableRows;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ctype = form.elements.coinType.value;

        try {
            const coinData = await fetchCoinData(ctype);
            console.log(`Received ${ctype} data:`, coinData);

            if (coinData.length > 0) {
                const coin = coinData[0]
                console.log(`Price of ${ctype}: $${coin.current_price}`);
                console.log(`Volume of ${ctype}: ${coin.total_volume}`);
                console.log(`Price change (24) of ${ctype}: ${coin.price_change_percentage_24h}%`);

                updateTable(ctype,coin.current_price ,coin.total_volume ,coin.price_change_percentage_24h ); 
            } else {
                console.log(`Data for ${ctype} is not available.`);
            }
        } catch (error) {
            console.error('Error fetching ${ctype} data:', error);
        }
    });

    const fetchCoinData = async (ctype) => {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ctype}&price_change_percentage=24h`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error fetching ${ctype}:', error);
        } 
    };
});