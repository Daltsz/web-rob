import Footer from "./index"
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'



describe("header", () => {
    test("Redenriza component Header", () => {
        render(<Footer/>)

    })
})