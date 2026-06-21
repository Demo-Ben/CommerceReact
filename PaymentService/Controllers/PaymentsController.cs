using Microsoft.AspNetCore.Mvc;
using PaymentService.Data;
using PaymentService.Models;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("payments")]
    public class PaymentsController : ControllerBase
    {
        // GET /payments
        // GET https://localhost:5004/payments
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(StaticPayments.Payments);
        }


        // POST /payments
        // POST https://localhost:5004/payments
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreatePaymentDto dto)
        {
            var newPayment = new Payment
            {
                Id = StaticPayments.Payments.Count + 1,
                OrderId = dto.OrderId,
                Amount = dto.Amount,  
                Status = "Completed",
                PaidAt = DateTime.UtcNow
            };

            StaticPayments.Payments.Add(newPayment);
            //return Ok(newPayment); // comment off to notify OrderService


            // Notify OrderService
            using var client = new HttpClient();
            var updateBody = new { orderId = dto.OrderId };
            await client.PostAsJsonAsync("https://localhost:5002/payments/update", updateBody);

            return Ok(newPayment);
        }

    }
}
