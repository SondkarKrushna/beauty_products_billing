import React from 'react'
import InStockProducts from '../componants/Products/InStockProducts'
import ProductsSidebar from '../componants/Products/ProductsSidebar'

const InStock = () => {
    return <>
        <div className="max-w-[1600px] mx-auto flex items-stretch gap-6 py-2">
            <div className="flex flex-col lg:flex-row gap-3">
                <InStockProducts />
            </div>
        </div>
    </>
}

export default InStock