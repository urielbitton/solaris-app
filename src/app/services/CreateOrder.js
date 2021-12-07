import { db } from '../firebase/fire'

export default function CreateOrder(orderId, orderNumber, customer, totalPrice) {
  const dateCreated = new Date()

  const orderObj = {
    orderId,
    orderNumber,
    userID: customer.userID,
    customer,
    totalPrice,
    dateCreated
  }
  return db.collection('orders').doc(orderId).set(orderObj)
}