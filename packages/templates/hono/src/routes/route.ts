import { Hono } from 'hono'
import { checkoutRouter } from './dodopayments/checkout'
import { customerRouter } from './dodopayments/customer'
import { paymentsRouter } from './dodopayments/payments'
import { productsRouter } from './dodopayments/products'
import { subscriptionsRouter } from './dodopayments/subscriptions'
import { webhookRouter } from './dodopayments/webhook'

const app = new Hono()

app.route('/checkout', checkoutRouter)
app.route('/customer', customerRouter)
app.route('/payments', paymentsRouter)
app.route('/products', productsRouter)
app.route('/subscriptions', subscriptionsRouter)
app.route('/webhook', webhookRouter)

export { app as dodopaymentsRouter }
