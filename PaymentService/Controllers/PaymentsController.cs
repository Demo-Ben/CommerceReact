using Microsoft.AspNetCore.Mvc;
using PaymentService.Data;
using PaymentService.Models;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("payments")]
    public class PaymentsController : ControllerBase
    {
        // DTO for pay again endpoint
        public class PayAgainDto
        {
            public decimal Total { get; set; }
        }

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

            // Notify OrderService
            using var client = new HttpClient();
            var updateBody = new { orderId = dto.OrderId };
            await client.PostAsJsonAsync("https://localhost:5002/payments/update", updateBody);

            return Ok(newPayment);
        }


        // POST /payments/{id}/payagain
        [HttpPost("{id}/payagain")]
        public async Task<IActionResult> PayAgain(int id, [FromBody] PayAgainDto dto)
        {
            if (dto == null || dto.Total <= 0)
                return BadRequest("Invalid total");

            var newPayment = new Payment
            {
                Id = StaticPayments.Payments.Count + 1,
                OrderId = id,
                Amount = dto.Total,
                Status = "Completed",
                PaidAt = DateTime.UtcNow
            };

            StaticPayments.Payments.Add(newPayment);

            // Notify OrderService that the order was paid
            using var client = new HttpClient();
            var updateBody = new { orderId = id };
            await client.PostAsJsonAsync("https://localhost:5002/payments/update", updateBody);

            return Ok(newPayment);
        }
    }
}
