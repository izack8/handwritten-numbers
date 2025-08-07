import DrawingCanvas from './DrawingCanvas';
function Home(){
    
    return (
        <main className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 py-12 md:py-16 lg:py-0">
            <h1 className="text-3xl text-center">Welcome to the Handwritten Numbers App</h1>
            <DrawingCanvas />
        </main>
    )
}

export default Home;