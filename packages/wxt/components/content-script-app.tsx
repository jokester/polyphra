import React from "react";
import {createRoot} from 'react-dom/client'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Button } from "primereact/button";


const App: React.FC = ( ) => {
    return <Button onClick={() => alert('hi')}>fff</Button>
}

export function mount(el: HTMLElement) {
    const r = createRoot(el)
    r.render(<PrimeReactProvider><App /></PrimeReactProvider>)
}