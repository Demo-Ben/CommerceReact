using System.Collections.Generic;
using OrderService.Models;

namespace OrderService.Data
{
    public static class StaticOrders
    {
        public static List<Order> Orders = new()
        {
            new Order { Id = 1, ItemId = 1, Quantity = 2, Total = 3000, Status = "Pending" },
            new Order { Id = 2, ItemId = 2, Quantity = 1, Total = 100, Status = "Paid" }
        };
    }
}
