using InventoryService.Models;
using System.Collections.Generic;

namespace InventoryService.Data
{
    public static class StaticInventory
    {
        public static List<Inventory> Items = new()
        {
            new Inventory { Id = 1, Name = "Laptop", Price = 1500, Stock  = 10 },
            new Inventory { Id = 2, Name = "Keyboard", Price = 100, Stock  = 25 },
            new Inventory { Id = 3, Name = "Mouse", Price = 50, Stock  = 40 }
        };
    }
}
