import { useOrders } from '../../context/OrdersContext'
import { useNavigate } from "react-router-dom"
import { RiStarFill, RiWalletLine } from '@remixicon/react'
import { useRef, useState } from 'react'
import TitleBar from "../../components/TitleBar"
import OrderIcon from "../../assets/icons/order.png"
import Loader from '../../components/Loader'
import { toast } from 'sonner'
import { useEffect } from 'react'

function OrderCard({ id, orderId, placedTime, items, total, payMethod }) {

    const navigate = useNavigate()
    const { cancelOrder, review, reviewStatus, reviewStatusLoading, returnOrder } = useOrders()
    const [rate, setRate] = useState(0)
    const [hidden, setHidden] = useState(false)
    const [reviewItem, setReviewItem] = useState({})
    const comment = useRef(null)
    const date = new Date(placedTime)

    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Colombo",
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    })

    let createdAt = formatter.format(date)

    createdAt = createdAt.replace(/\b(am|pm)\b/i, match => match.toUpperCase())

    const handleReviewSubmit = (productId) => {

        if (rate === 0) {
            toast.info("Click starts to rate product !")
            return
        }

        let details = {
            product: productId,
            orderId: id,
            rating: rate,
            comment: comment.current.value
        }

        review(details)
        setHidden(false)
        setRate(0)

    }

    const statusClasses = {
        delivered: 'bg-green-500/10 text-green-800/90 border-green-700/35',
        processing: 'bg-warning/10 text-warning border-warning/30',
        shipped: 'text-blue-900/90 border-blue-400/60 bg-blue-100/70',
        cancelled: 'bg-danger/10 text-danger border-danger/25',
        default: 'text-primary/85 border-secondary/30 bg-secondary/8',
    }

    function getStatusClass(status) {
        return statusClasses[status] || statusClasses.default
    }

    const orderItems = items.map(item => {

        const dayPassed = (new Date() - new Date(item.deliveredAt)) / (1000 * 60 * 60 * 24)

        return (<div key={item.product._id} className="flex flex-col bg-white/30 backdrop-blur-xs cursor-pointer border rounded-[3px] border-secondary/20 shadow-xs py-3 px-3">

            {/* <div className='flex'>
                <p onClick={() => navigate(`/product/${item.product.slug}`)} className="text-xs text-primary line-clamp-1 w-4/7 sm:w-3/5 select-none">{item.product.name}</p>
                <p className={`text-[10px] flex justify-center min-w-18 nunito font-bold border ${item.orderStatus === 'delivered' ? 'bg-green-600/10 text-green-700 border-green-300' : item.orderStatus === 'processing' ? 'bg-warning/10 text-warning/80 border-warning/20' : item.orderStatus === 'shipped' ? 'text-blue-800/90 border-blue-300 bg-blue-100/90' : item.orderStatus === 'cancelled' ? 'bg-danger/10 text-danger border-danger/20' : item.orderStatus === 'return requested' ? 'bg-yellow-100/40 text-yellow-700 border-yellow-600/30' : 'text-neutral-600 border-neutral-400/70 bg-neutral-200'} px-3 py-px sm:py-0.5 rounded-full select-none ml-auto`}>{item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1)}</p>
            </div> */}

            <div className='flex'>
                <img onClick={() => navigate(`/product/${item.product.slug}`)} className='aspect-square max-w-16 max-h-16 sm:max-w-20 sm:max-h-20 object-cover border border-secondary/25 rounded-[3px]' src={item.product.image} alt={`${item.product.slug}.jpg`} loading="lazy" />

                <div className='flex flex-col ml-3 w-full'>

                    <div className='flex'>
                        <p onClick={() => navigate(`/product/${item.product.slug}`)} className="text-xs text-primary line-clamp-1 w-4/7 sm:w-3/5 select-none">{item.product.name}</p>
                        <p className={`text-[10px] flex justify-center min-w-18 nunito font-bold border ${getStatusClass(item.orderStatus)} px-3 py-px rounded-full select-none ml-auto capitalize`}>{item.orderStatus}</p>
                    </div>

                    <div className='flex flex-col justify-between h-full gap-1 cursor-default mt-1 sm:mt-0'>
                        <p className="text-xs text-secondary">Quantity * Price &nbsp; <span className='text-[seagreen]'>( {item.quantity} * {item.product.price} )</span></p>
                        <div className='flex gap-1'>
                            <span className="text-xs text-secondary">Total&nbsp;</span>
                            <p className="text-xs text-[seagreen]">( {(item.quantity * item.product.price).toFixed(2)} LKR )</p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-1 sm:gap-3'>
                            {item.returnStatus && <p className="text-xs text-secondary capitalize">Return Status <span className='text-orange-700'>&nbsp;( {item.returnStatus} )</span></p>}
                            {item.refundStatus && <p className="text-xs text-secondary capitalize">Refund Status <span className='text-purple-800'>&nbsp;( {item.refundStatus} )</span></p>}
                            {/* {item.orderStatus === 'cancelled' && <p className="text-xs text-secondary capitalize">Order Status <span className='text-red-700'>&nbsp;( {item.orderStatus} )</span></p>} */}
                        </div>
                    </div>

                    {item.orderStatus === 'delivered' && !item.returnStatus && dayPassed <= 7 && <div className="flex flex-col sm:flex-row mt-2 gap-2 sm:items-center">
                        <button onClick={() => returnOrder(orderId, item.product._id)} className='text-xs text-[tomato] rounded-xs cursor-pointer hover:text-[tomato]/70 transition-colors w-fit sm:w-auto'>Request Return</button>
                        <span className='hidden sm:block text-xs cursor-default'>* Request to return. ( Returns accepted within 7 days of delivery )</span>
                        {/* We will contact you via email */}
                    </div>}

                    {item.orderStatus === 'processing' && <div className="flex flex-col sm:flex-row mt-2 gap-2 sm:items-center">
                        <button onClick={() => cancelOrder(orderId, item.product._id)} className='text-xs text-[tomato] rounded-xs cursor-pointer hover:text-[tomato]/70 transition-colors w-fit sm:w-auto'>Cancel Order</button>
                        <span className='hidden sm:block text-xs cursor-default'>* Cancellation available until shipment.</span>
                    </div>}

                </div>

            </div>

            <div >
                {/* {item.orderStatus === 'delivered' && <div className='flex gap-2 mt-3'>
                    <button disabled={reviewStatus && (reviewStatus[item.product._id] ? true : false)} onClick={() => { setReviewItem(item.product._id); setHidden(true) }} className={`text-xs my-auto text-left ${reviewStatus ? (reviewStatusLoading ? 'text-blue-500' : reviewStatus[item.product._id] ? 'text-green-600' : 'text-warning/80 cursor-pointer') : 'text-blue-500'} select-none`}>{reviewStatus ? (reviewStatusLoading ? 'Syncing...' : reviewStatus[item.product._id] ? 'Reviewed' : 'Review') : 'Syncing...'}</button>
                    <span className='text-xs cursor-default'>* Click here to provide feedback.</span>
                    </div>} */}

                {item.orderStatus === 'delivered' && <div className='flex gap-2 mt-3'>
                    <button disabled={reviewStatus && (reviewStatus[item.product._id] ? true : false)} onClick={() => { setReviewItem(item.product._id); setHidden(true) }} className={`text-xs my-auto text-left ${reviewStatus ? (reviewStatusLoading ? 'text-blue-500' : reviewStatus[item.product._id] ? 'text-green-600' : 'text-green-700 cursor-pointer') : 'text-blue-500'} select-none`}>{reviewStatusLoading ? 'Syncing...' : reviewStatus[item.product._id] ? 'Reviewed' : 'Review'}</button>
                    {reviewStatus[item.product._id] ? null : <span className='hidden sm:block  text-xs cursor-default'>* Click here to provide feedback.</span>}
                </div>}

            </div>

            {reviewItem === item.product._id && item.orderStatus === 'delivered' &&
                <>
                    {hidden && <>
                        <button onClick={() => { setHidden(false); setReviewItem(null); setRate(0) }} className={`text-xs text-red-400 mr-auto mt-3 cursor-pointer`}>Cancel Review</button>
                        <div className="flex flex-col gap-4 my-2">
                            <div>
                                <TitleBar firstText={'Write a Review'} className={'text-xs! sm:text-sm!'} showLine />
                            </div>
                            <p className="text-xs text-secondary line-clamp-1 w-3/5 select-none">{item.product.name}</p>
                            <div className="flex gap-4 place-items-center">
                                <div className="flex gap-1.25">
                                    {[1, 2, 3, 4, 5].map(value => (
                                        <span key={value} onClick={() => setRate(prev => prev === value ? 0 : value)} className="cursor-pointer"><RiStarFill size={16} className={`${rate >= value ? 'text-yellow-400' : 'text-secondary/20'} `} /></span>
                                    ))}
                                </div>
                                <p className="text-xs text-secondary/60 outfit select-none">Click stars to rate product</p>
                            </div>
                            <form onSubmit={(e) => { handleReviewSubmit(item.product._id); e.preventDefault() }} className='flex flex-col gap-4'>
                                <textarea ref={comment} placeholder="Write a Review" className="h-20 text-xs nunito px-4 py-2 border border-secondary/20 rounded-[3px] w-full outline-gray "></textarea>
                                <button type='submit' className="text-xs w-fit text-white uppercase font-medium border outfit border-primary/50 bg-primary px-5 py-2.5 rounded-[3px] hover:bg-transparent hover:text-secondary hover:border-secondary/20 cursor-pointer transition-colors duration-300">Add Review</button>
                            </form>
                        </div></>}
                </>}

        </div>)
    })

    return (
        <div className="flex flex-col px-5 py-3 outfit h-fit bg-accent/40 border border-secondary/20 rounded-[3px]">
            <div className="flex flex-col gap-1 sm:flex-row justify-between">
                <h6 className="text-sm font-medium text-black/75">{orderId}</h6>
                <div className='flex gap-2 text-xs align-center'>
                    <RiWalletLine className='text-primary' size={14} />
                    <span className='text-secondary/80 mr-2'>Payment via  <span className='text-primary/90 text-[10px] uppercase font-medium'> {payMethod}</span></span>
                </div>
            </div>

            <p className="text-xs text-secondary/80 mt-1.5 sm:mt-0">{createdAt}</p>

            <div className="flex flex-col mt-2 gap-3">
                {orderItems}
            </div>

            {total > 0 ? <div className="flex justify-between mt-4">
                <label className="text-xs text-secondary">Total</label>
                <p className="text-xs text-primary">{total.toFixed(2)} LKR</p>
            </div> : <p className='mt-4 text-xs font-medium text-red-500/80'>Order cancelled</p>}
        </div >
    )
}

function MyOrders() {

    const { orders, loading } = useOrders()

    const orderList = orders.map(order => (<OrderCard key={order.orderId} id={order._id} orderId={order.orderId} placedTime={order.createdAt} items={order.items} total={order.totalAmount} payMethod={order.paymentMethod} />))

    return (
        <div>
            <div>
                <TitleBar firstText={'Order'} secText={'History'} showLine />
            </div>
            {loading ? <div className='flex justify-center items-center w-full mt-30 mb-20'><Loader /></div> :
                <>
                    {orderList.length === 0 ?
                        <div className='flex flex-col justify-center items-center gap-3 mt-20 mb-10'>
                            <img src={OrderIcon} alt="HeartIcon" className='w-25 sm:w-30' />
                            <h1 className='text-xl sm:text-2xl text-secondary outfit font-bold'>Your Orders List is Empty !</h1>
                            <p className='text-xs sm:text-sm text-gray-500 w-70 text-center sm:w-fit'>You haven’t placed any orders yet. Your order history will appear here once you make a purchase.</p>
                        </div> :
                        <div className="flex flex-col gap-3 my-4">
                            {orderList}
                        </div>}
                </>}
        </div>
    )
}
export default MyOrders