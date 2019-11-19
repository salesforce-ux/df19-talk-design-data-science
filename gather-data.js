/* EXAMPLE CODE FOR DF PRESENTATION */
const fs = require( 'fs' );
const pt = require( 'puppeteer' );
const urls = require( './list-of-urls.json' );

let resultCSV = 'font size, font weight\n'; // Our CSV 'file' we are going to build

// Our function to run on the page that will find all H1 tags and get their style
const getH1Styles = () => new Promise( ( resolve ) => {
    const h1 = document.getElementsByTagName( 'h1' ) ;
    const styles = Array.from( h1 ).map( getComputedStyle );

    resolve( styles.map( ( s ) => `"${ s.fontSize }", "${ s.fontWeight }"\n` ) );
});

// An asynchronouse function to load all of our sites in puppeteer and get our data
( async () => {
    const browser = await pt.launch( { headless: true } );
    for( const url of urls ) {
        const page = await browser.newPage();
        await page.goto( url, { waitUntil: 'networkidle0'} );
        resultCSV += await page.evaluate( getH1Styles );
        await page.close();
    }
    fs.writeFileSync( 'talk-test.csv', resultCSV );
    await browser.close();
} )();
