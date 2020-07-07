<div style="font-family: calibri,sans-serif;">
    <h4>Dear <?php echo $name . ' ' . $surname; ?>,</h4>
    <?php
    if (intval($duration) > 1) {
        $units_text = $units.'s';
    } else {
        $units_text = $units;
    }
    ?>

    <p>Welcome to the 1spot Media family. The subscription was successful. Your contract is for <?php echo $duration . ' ' . $units_text; ?>.</p>
    <?php

    if ($auto_renew === 'true' || $auto_renew === TRUE) {

        ?>
        <p>Renewal - The price is valid throughout the month of your contract. You have selected the automatic renewal option, therefore  <?php echo $duration; ?> month(s),
We will renew your contract and bill you automatically during the same period. If you want to change your subscription to not renew automatically, simply deactivate this option on our site.        </p>

        <?php
    }
    ?>
    <p>If you have any questions, please contact us by email at support@1spotmedia.com or access the Help button on our website.</p>
    <p>We hope you enjoy our content.</p>
    <p>
        Sincerely,<br>
        The 1Spot Media Team<br>
        <br>
    </p>
    <span style="font-size: 12px">Please do not respond to this message. It was sent from an automatic email address.</span><br>
</div>
