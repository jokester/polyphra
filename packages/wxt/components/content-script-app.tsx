import React from "react";
import {createRoot} from 'react-dom/client'
const App: React.FC = ( ) => {
    return <div onClick={() => alert('hi')}>fff</div>
}

export function mount(el: HTMLDivElement) {
    const r = createRoot(el)
    r.render(<App />)
}