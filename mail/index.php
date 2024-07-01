<?php

require_once 'lib/swift_required.php';
require 'vendor/autoload.php';


class FormHandler {
    private $emailFrom = 'zapros-lp@vip-finance.ru';
    private $emailFromName = 'Заявка с vip-finance.ru';

    private $emailTo = array(
        'zayavki-krown@yandex.ru'
    );

    function __construct() {
        //$this->transport = Swift_SmtpTransport::newInstance('localhost', 25);
        $this->transport = Swift_MailTransport::newInstance();
        $this->mailer = Swift_Mailer::newInstance($this->transport);
        $this->templater = Fenom::factory('templates', 'cache', []);
    }

    function sendMail($to, $subject, $fields, $template, $files = []) {
        $body = $this->templater->fetch($template, ['fields' => $fields]);

        $message = Swift_Message::newInstance()
        ->setSubject($subject)
        ->setCharset('UTF-8') // Установить кодировку UTF-8
        ->setFrom(array($this->emailFrom => $this->emailFromName))
        ->setTo($to)
        ->setBody($body, 'text/html');
            


        if(count($files)) {
            foreach($files as $name => $path) {
                $message->attach(
                    Swift_Attachment::fromPath($path)->setFilename($name)
                );
            }
        }

        return $this->mailer->send($message);
    }

    private function saveToCrm($inputFields) {
        $fields = array(
            "TITLE" => 'Заявка с vip-finance.ru',
            'NAME' => $inputFields['name'],
            "STATUS_ID" => "NEW",
            "OPENED" => "Y",
            "ASSIGNED_BY_ID" => 1,
            'EMAIL' => [['VALUE' => $inputFields['email'], 'VALUE_TYPE' => 'WORK']],
            'PHONE' => [['VALUE' => $inputFields['phone'], 'VALUE_TYPE' => 'WORK']]
        );

        $utms = json_decode($inputFields['utms'], true);

        foreach($utms as $key => $value) {
            $fields[strtoupper($key)] = $value;
        }

        $queryUrl = 'https://b24-lzwmfg.bitrix24.ru/rest/1/0b3mv8j3p4r55prq/crm.lead.add.json';
        $queryData = http_build_query(array(
            'fields' => $fields,
            'params' => array("REGISTER_SONET_EVENT" => "Y")
        ));

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_POST => 1,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $queryUrl,
            CURLOPT_POSTFIELDS => $queryData,
        ));

        $result = curl_exec($curl);
        curl_close($curl);


        return $result;
    }

    protected function process($fieldsList, $requiredFields, $subject, $template, $formId) {
        $fields = array();

        foreach($fieldsList as $fieldName) {
            if(substr($fieldName, -2) == '[]') {
                $fieldName = substr($fieldName, 0, -2);
                $val = filter_var($_REQUEST[$fieldName], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY);
            } else {
                $val = filter_var($_REQUEST[$fieldName], FILTER_SANITIZE_STRING);
            }

            if($fieldName == 'utms') {
                $val = $_REQUEST['utms'];
            }


            $fields[$fieldName] = $val;
            if(!$val) {
                $fields[$fieldName] = '';
            }
        }

        $wrongFields = array();

        foreach($requiredFields as $fieldName) {
            if(is_array($fieldName)) {
                $ok = false;

                foreach($fieldName as $subFieldName) {
                    if(isset($fields[$subFieldName]) && strlen($fields[$subFieldName])) {
                        switch($subFieldName) {
                            case 'email':
                                if(filter_var($fields[$subFieldName], FILTER_VALIDATE_EMAIL)) {
                                    $ok = true;
                                }
                                break;

                            case 'phone':
                                if(strlen(preg_replace("/\D/", '', $fields[$subFieldName])) > 10) {
                                    $ok = true;
                                }
                                break;

                            default:
                                $ok = true;
                        }

                        if($ok) {
                            break;
                        }
                    }
                }

                if(!$ok) {
                    $wrongFields = array_merge($wrongFields, $fieldName);
                }
            } else {
                if(isset($fields[$fieldName]) && (strlen($fields[$fieldName]) || (is_array($fields[$fieldName]) && count($fields[$fieldName])) )) {

                    switch($fieldName) {
                        case 'email':
                            if(!filter_var($fields[$fieldName], FILTER_VALIDATE_EMAIL)) {
                                $wrongFields[] = $fieldName;
                            }
                            break;

                        case 'phone':
                            if(strlen(preg_replace("/\D/", '', $fields[$fieldName])) < 11) {
                                $wrongFields[] = $fieldName;
                            }
                            break;

                        default:
                            break;
                    }

                } else {
                    $wrongFields[] = $fieldName;
                }
            }
        }

        if(count($wrongFields)) {
            $result = array(
                'status' => 'wrong',
                'fields' => $wrongFields
            );
        } else {

            $files = [];

            if(isset($_FILES['file'])) {
                foreach($_FILES['file']['name'] as $key => $name) {
                    if(file_exists($_FILES['file']['tmp_name'][$key])) {
                        $files[$_FILES['file']['name'][$key]] = $_FILES['file']['tmp_name'][$key];
                    }
                }
            }

            $result = [];

            //$result['fields'] = $this->saveToCrm($fields);

            if($this->sendMail($this->emailTo, $subject, $fields, $template, $files)) {

                $result['status'] = 'success';
                $result['message'] = 'Ваше сообщение успешно отправлено!';

            } else {
                $result['status'] = 'error';
            }
        }

        return $result;
    }


    public function handle() {
        $formId = filter_var($_REQUEST['formId'], FILTER_SANITIZE_STRING);

        $fields = array('name', 'phone', 'agree');
        $requiredFields = array('phone', 'agree');

        $template = 'default.tpl';

        switch($formId) {
            case 'call':
                $subject = 'Заказ звонка vip-finance.ru';
                break;

            case 'estimate':
                $subject = 'Заказ оценки vip-finance.ru';
                break;

            default:
                $subject = 'Заказ с сайта vip-finance.ru';

                break;
        }

        return $this->process($fields, $requiredFields, $subject, $template, $formId);
    }
}

$handler = new FormHandler();
echo json_encode($handler->handle());