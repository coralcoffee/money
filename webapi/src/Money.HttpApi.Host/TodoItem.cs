namespace Money
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public bool IsDone { get; set; }
        public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    }
}
