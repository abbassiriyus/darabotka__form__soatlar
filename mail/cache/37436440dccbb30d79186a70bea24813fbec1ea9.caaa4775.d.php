<?php 
/** Fenom template 'default.tpl' compiled at 2024-03-15 15:01:57 */
return new Fenom\Render($fenom, function ($var, $tpl) {
?><?php
/* default.tpl:6: {set $fieldNames = [
    'name' => 'Имя',
    'phone' => 'Телефон',
    'email' => 'E-mail',
    'company' => 'Название компании'
]} */
 $var["fieldNames"]=array('name' => 'Имя', 'phone' => 'Телефон', 'email' => 'E-mail', 'company' => 'Название компании'); ?>

<?php  if(!empty($var["fields"]) && (is_array($var["fields"]) || $var["fields"] instanceof \Traversable)) {
  foreach($var["fields"] as $var["field"] => $var["value"]) { ?>
    <?php
/* default.tpl:9: {if $value? && isset($fieldNames[$field])} */
 if(!empty($var["value"]) && isset($var["fieldNames"][$var["field"]])) { ?>
        <strong><?php
/* default.tpl:10: {$fieldNames[$field]} */
 echo $var["fieldNames"][$var["field"]]; ?></strong>:
        <?php
/* default.tpl:11: {if is_array($value)} */
 if(is_array($var["value"])) { ?>
            <?php
/* default.tpl:12: {implode(', ', $value)} */
 echo implode(', ', $var["value"]); ?>
        <?php
/* default.tpl:13: {else} */
 } else { ?>
            <?php
/* default.tpl:14: {$value} */
 echo $var["value"]; ?>
        <?php
/* default.tpl:15: {/if} */
 } ?>

        <br/>
    <?php
/* default.tpl:18: {/if} */
 } ?>
<?php
/* default.tpl:19: {/foreach} */
   } } ?>

<?php
/* default.tpl:21: {if $fields['utms']?} */
 if(!empty($var["fields"]['utms'])) { ?>
    <br/><br/><strong>UTM-метки:</strong><br/>
    <?php
/* default.tpl:23: {set $utms = json_decode($fields['utms'],1)} */
 $var["utms"]=json_decode($var["fields"]['utms'], 1); ?>
    <?php  if(!empty($var["utms"]) && (is_array($var["utms"]) || $var["utms"] instanceof \Traversable)) {
  foreach($var["utms"] as $var["key"] => $var["value"]) { ?>
        <?php
/* default.tpl:25: {$key} */
 echo $var["key"]; ?> = <?php
/* default.tpl:25: {$value} */
 echo $var["value"]; ?><br/>
    <?php
/* default.tpl:26: {/foreach} */
   } } ?>
<?php
/* default.tpl:27: {/if} */
 } ?><?php
}, array(
	'options' => 0,
	'provider' => false,
	'name' => 'default.tpl',
	'base_name' => 'default.tpl',
	'time' => 1710514524,
	'depends' => array (
  0 => 
  array (
    'default.tpl' => 1710514524,
  ),
),
	'macros' => array(),

        ));
