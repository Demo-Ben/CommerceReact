namespace PaymentService.Models
{
    public class CreatePaymentDto
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        // optional: public decimal Amount { get; set; }
    }
}
