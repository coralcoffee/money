namespace Money.Endpoints;

public abstract class EndpointGroupBase
{
    public virtual string GroupName => this.GetType().Name;

    public abstract void Map(RouteGroupBuilder groupBuilder);
}
