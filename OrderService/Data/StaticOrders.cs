using System.Collections.Generic;
using OrderService.Models;

namespace OrderService.Data
{
    public static class StaticOrders
    {
        public static List<Order> Orders = new()
        {
            new Order { Id = 1, ItemId = 1, Quantity = 1, Total = 1500, Status = "Paid" },
            new Order { Id = 2, ItemId = 2, Quantity = 1, Total = 100, Status = "Paid" },
            new Order { Id = 3, ItemId = 3, Quantity = 1, Total = 40, Status = "Pending" }
        };
    }
}
