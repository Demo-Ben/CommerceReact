using System.Collections.Generic;
using OrderService.Models;

namespace OrderService.Data
{
    public static class StaticOrders
    {
        public static List<Order> Orders = new()
        {
            new Order { Id = 1, ProductId = 1, Quantity = 1, Amount = 1500, Status = "Paid" },
            new Order { Id = 2, ProductId = 2, Quantity = 1, Amount = 100, Status = "Paid" },
            new Order { Id = 3, ProductId = 3, Quantity = 1, Amount = 40, Status = "Pending" }
        };
    }
}
