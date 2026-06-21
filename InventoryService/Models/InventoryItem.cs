//namespace InventoryService.Models
//{
//    public class InventoryItem
//    {
//        public int Id { get; set; }          // primary key
//        public string Name { get; set; }     // display name
//        public decimal Price { get; set; }   // unit price
//        public int QuantityAvailable { get; set; }
//    }
//}

namespace InventoryService.Models
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}
