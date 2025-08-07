import DrawingCanvas from './DrawingCanvas';
function Home(){
    
    return (
        <main className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 pt-30">
            <h1 className="text-3xl text-center mb-10">Welcome to the MNIST Handwritten Digit Recognition App</h1>
            <p className="text-center">Draw a digit on the canvas below and click "Predict" to see the model's prediction.</p>
            <DrawingCanvas />
        </main>
    )
}

export default Home;