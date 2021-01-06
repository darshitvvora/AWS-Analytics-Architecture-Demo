import React,{Component} from 'react';
import './App.css';
import Amplify, {Analytics, AWSKinesisFirehoseProvider } from 'aws-amplify';
import config from './aws-exports'

Amplify.configure({
  Auth: {
    identityPoolId: config.aws_cognito_identity_pool_id,
    region: config.aws_project_region
  },
  Analytics: {
    AWSKinesisFirehose: {
      region: config.aws_project_region
    }
  }
});

Analytics.addPluggable(new AWSKinesisFirehoseProvider());

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			products : [
				{name: "The Mayflower", views: 0},
				{name: "1969 Harley Davidson Ultimate Chopper", views: 0},
				{name: "1968 Ford Mustang", views: 0},
				{name: "1980s Black Hawk Helicopter", views: 0},
				{name: "The Mayflower", views: 0},
				{name: "1999 Yamaha Speed Boat", views: 0},
				{name: "Collectable Wooden Train", views: 0},
				{name: "1982 Lamborghini Diablo", views: 0}
			]
		}
	}

	view (i) {
		let newProducts = [...this.state.products];
		newProducts[i].views++;
		this.setState({products: newProducts});
	
	const pin = document.getElementById('pin').value;
	const userid = document.getElementById('userid').value;
    const now = new Date();

    let data = {
	  id: now.getTime(),
	  userid: +userid,
	  pin: +pin,
      product: newProducts[i].name
    }
    Analytics.record({
      data: data,
      streamName: config.aws_firehose_name
    }, 'AWSKinesisFirehose');
	}

	render(){
		return(
			<div>
				<h1>Your Antique Product Catalog!</h1>
				<div>
					<label htmlFor="userid">Customer Number:</label>
					<input type="text" id="userid" name="userid"/><br/><br/>
					<label htmlFor="pin">Postal Code:</label>
					<input type="text" id="pin" name="pin"/><br/><br/>
				</div>
				<div className="products">
					{
						this.state.products.map((prod, i) => 
							<div key={i} className="product">
								<div className="viewCount">
									{prod.views}
								</div>
								<div className="productName">
									{prod.name}
								</div>
								<button onClick={this.view.bind(this, i)}>View</button>
							</div>
						)
					}
				</div>
			</div>
		);
	}
}
export default App;