import React from 'react'
import OutStockProducts from '../componants/Products/OutStockProducts'
import ProductsSidebar from '../componants/Products/ProductsSidebar'

const OutOfStock = () => {
    return <>
        <div className="max-w-[1600px] mx-auto flex items-stretch gap-6 py-2">
            <div className="flex flex-col lg:flex-row gap-3">
                <OutStockProducts />
            </div>
        </div>
    </>
}

export default OutOfStock