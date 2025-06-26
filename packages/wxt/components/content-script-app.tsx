import React from "react";
import { createRoot } from 'react-dom/client'
import { Modal } from './english-learning-app'
const App: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false)
    return <div >
        <button onClick={() => setShowModal(value => !value)}>toggle</button>
        {showModal && <Modal />}
    </div>
}

export function mount(el: HTMLDivElement) {
    const r = createRoot(el)
    r.render(<App />)
}