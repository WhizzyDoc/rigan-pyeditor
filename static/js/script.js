
const base_url = `https://riganapi.pythonanywhere.com/api/v3/`;

function buy_key(email, elem) {
    let url = `${base_url}activation/buy_key/`;
    const formData = new FormData()
    formData.append('email', email);
    elem.html(`<i class="fa fa-refresh"></i> Processing...`).attr('disabled', true)
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => {return res.json()})
    .then(data => {
      //console.log(data);
      elem.html(`Buy Activation Key`).attr('disabled', false)
      if(data.status == 'success') {
        d = data.data;
        $('#p_email').html(d.email)
        $('#p_amt').html(`N${d.amount}`)
        $('#p_ref').html(`${d.reference_id}`)

        $('#pk').val(data.paystack_pub_key)
        $('#ref_id').val(d.reference_id)
        $('#pay_amt').val(d.amount)
        $('#pay_email').val(d.email)

        $('.email-con').hide()
        $('.pay-con').show()
      }
      else {
        swal(data.status, data.message, data.status)
      }
    })
    .catch(err => {
        console.log(err)
        elem.html(`Buy Activation Key`).attr('disabled', false)
        swal("Error", "Please check your internet connection", "error")
    })
  }

  function payWithPaystack() {
		let currency = "NGN";
		let plan = "";
		let ref = $('#ref_id').val();
		let amount = $('#pay_amt').val();

		let obj = {
			key: $('#pk').val(),
			email: $('#pay_email').val(),
			amount: Number(amount)*100,
			ref: ref,
			callback: function (response) {
          console.log(response);
          verifyPayment(ref);
			},
		};
		if (Boolean(currency)) {
			obj.currency = currency.toUpperCase();
		}
		if (Boolean(plan)) {
			obj.plan = plan;
		}

		var handler = PaystackPop.setup(obj);
		handler.openIframe();
	}

  function verifyPayment(ref) {
    let url = `${base_url}activation/verify_payment/`;
    const formData = new FormData()
    formData.append('reference_id', ref);
    $('.pay-btn').html(`<i class="fa fa-refresh"></i> Processing...`).attr('disabled', true)
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => {return res.json()})
    .then(data => {
      //console.log(data);
      $('.pay-btn').html(`Proceed with Payment`).attr('disabled', false)
      if(data.status == 'success') {
        swal('Success', data.message, 'success');
        $('.email-con').show()
        $('.pay-con').hide()
      }
      else {
        swal(data.status, data.message, data.status)
      }
    })
    .catch(err => {
        console.log(err)
        $('.pay-btn').html(`Proceed with Payment`).attr('disabled', false)
        swal("Error", "Please check your internet connection", "error")
    })
  }