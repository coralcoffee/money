using System.ComponentModel.DataAnnotations;

namespace Money.Accounts;

public class CreateAccountDto
{
    [Required]
    [StringLength(AccountConsts.NameMaxLength)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public AccountType AccountType { get; set; }

    [Required]
    public OwnerType OwnerType { get; set; }

    [Required]
    [StringLength(AccountConsts.AccountNumberMaxLength)]
    public string AccountNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(AccountConsts.BrokerOrInstitutionMaxLength)]
    public string BrokerOrInstitution { get; set; } = string.Empty;
}
