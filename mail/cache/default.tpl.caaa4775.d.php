<?php 
/** Fenom template 'default.tpl' compiled at 2018-03-21 13:45:40 */
return new Fenom\Render($fenom, function ($var, $tpl) {
?><?php
/* default.tpl:19: {set $fieldNames = [
    'name' => 'Имя',
    'phone' => 'Телефон',
    'email' => 'E-mail',
    'city' => 'Город',
    'type' => 'Тип бани',
    'sections' => 'Секций',
    'length' => 'Длина',
    'width' => 'Ширина',
    'agree' => 'Согласие на обработку ПД',
    'text' => 'Вопрос',
    'move' => 'Как',
    'size' => 'Размеры',
    'palet' => 'Цветовая палитра',
    'add' => 'Дополнительные элементы',
    'gift' => 'Подарки',
    'product' => 'Баня',
    'additional' => 'Дополнительные постройки'
]} */
 $var["fieldNames"]=array('name' => 'Имя', 'phone' => 'Телефон', 'email' => 'E-mail', 'city' => 'Город', 'type' => 'Тип бани', 'sections' => 'Секций', 'length' => 'Длина', 'width' => 'Ширина', 'agree' => 'Согласие на обработку ПД', 'text' => 'Вопрос', 'move' => 'Как', 'size' => 'Размеры', 'palet' => 'Цветовая палитра', 'add' => 'Дополнительные элементы', 'gift' => 'Подарки', 'product' => 'Баня', 'additional' => 'Дополнительные постройки'); ?>

<?php  if(!empty($var["fields"]) && (is_array($var["fields"]) || $var["fields"] instanceof \Traversable)) {
  foreach($var["fields"] as $var["field"] => $var["value"]) { ?>
    <?php
/* default.tpl:22: {if $value? && isset($fieldNames[$field])} */
 if(!empty($var["value"]) && isset($var["fieldNames"][$var["field"]])) { ?>
        <strong><?php
/* default.tpl:23: {$fieldNames[$field]} */
 echo $var["fieldNames"][$var["field"]]; ?></strong>:
        <?php
/* default.tpl:24: {if is_array($value)} */
 if(is_array($var["value"])) { ?>
            <?php
/* default.tpl:25: {implode(', ', $value)} */
 echo implode(', ', $var["value"]); ?>
        <?php
/* default.tpl:26: {else} */
 } else { ?>
            <?php
/* default.tpl:27: {$value} */
 echo $var["value"]; ?>
        <?php
/* default.tpl:28: {/if} */
 } ?>

        <br/>
    <?php
/* default.tpl:31: {/if} */
 } ?>
<?php
/* default.tpl:32: {/foreach} */
   } } ?>

<?php
/* default.tpl:34: {if $fields['utms']?} */
 if(!empty($var["fields"]['utms'])) { ?>
    <br/><br/><strong>UTM-метки:</strong><br/>
    <?php
/* default.tpl:36: {set $utms = json_decode($fields['utms'],1)} */
 $var["utms"]=json_decode($var["fields"]['utms'], 1); ?>
    <?php  if(!empty($var["utms"]) && (is_array($var["utms"]) || $var["utms"] instanceof \Traversable)) {
  foreach($var["utms"] as $var["key"] => $var["value"]) { ?>
        <?php
/* default.tpl:38: {$key} */
 echo $var["key"]; ?> = <?php
/* default.tpl:38: {$value} */
 echo $var["value"]; ?><br/>
    <?php
/* default.tpl:39: {/foreach} */
   } } ?>
<?php
/* default.tpl:40: {/if} */
 } ?><?php
}, array(
	'options' => 0,
	'provider' => false,
	'name' => 'default.tpl',
	'base_name' => 'default.tpl',
	'time' => 1521638826,
	'depends' => array (
  0 => 
  array (
    'default.tpl' => 1521638826,
  ),
),
	'macros' => array(),

        ));
