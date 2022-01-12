import { db } from '../firebase/fire'

export default function CreateOrder(orderId, orderNumber, product, customer, totalPrice) {
  const dateCreated = new Date()

  const orderObj = {
    orderId,
    orderNumber,
    userID: customer.userID,
    customer,
    totalPrice,
    dateCreated,
    product
  }
  return db.collection('orders').doc(orderId).set(orderObj)
}