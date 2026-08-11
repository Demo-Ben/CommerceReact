using PaymentService.Models;

namespace PaymentService.Data
{
    public static class StaticPayments
    {
        public static List<Payment> Payments = new()
        {
            new Payment { Id = 1, OrderId = 1, Amount = 1500, Status = "Completed", PaidAt = new DateTime(2026, 1, 20, 00, 00, 00, DateTimeKind.Utc) },
            new Payment { Id = 2, OrderId = 2, Amount = 100, Status = "Completed", PaidAt = new DateTime(2026, 2, 28, 00, 00, 00, DateTimeKind.Utc).AddMinutes(-10) }
        };
    }
}
