using PaymentService.Models;

namespace PaymentService.Data
{
    public static class StaticPayments
    {
        public static List<Payment> Payments = new()
        {
            new Payment { Id = 1, OrderId = 1, Amount = 100, Status = "Completed", PaidAt = DateTime.UtcNow },
            new Payment { Id = 2, OrderId = 2, Amount = 200, Status = "Completed", PaidAt = DateTime.UtcNow.AddMinutes(-10) }
        };
    }
}
