{set $fieldNames = [
    'name' => 'Имя',
    'phone' => 'Телефон',
    'email' => 'E-mail',
    'company' => 'Название компании'
]}

{foreach $fields as $field => $value}
    {if $value? && isset($fieldNames[$field])}
        <strong>{$fieldNames[$field]}</strong>:
        {if is_array($value)}
            {implode(', ', $value)}
        {else}
            {$value}
        {/if}

        <br/>
    {/if}
{/foreach}

{if $fields['utms']?}
    <br/><br/><strong>UTM-метки:</strong><br/>
    {set $utms = json_decode($fields['utms'],1)}
    {foreach $utms as $key => $value}
        {$key} = {$value}<br/>
    {/foreach}
{/if}